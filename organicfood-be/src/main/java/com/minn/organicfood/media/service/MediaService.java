package com.minn.organicfood.media.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.minn.organicfood.media.domain.Asset;
import com.minn.organicfood.media.domain.enums.AssetFolder;
import com.minn.organicfood.media.insfra.cloudinary.CloudinaryProperties;
import com.minn.organicfood.media.repository.AssetRepository;
import com.minn.organicfood.shared.exception.BusinessException;
import com.minn.organicfood.shared.exception.ErrorCode;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.minn.organicfood.shared.exception.ErrorCode.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional(readOnly = true)
@Slf4j
public class MediaService {

    Cloudinary cloudinary;
    CloudinaryProperties properties;
    AssetRepository assetRepository;

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final List<String> ALLOWED_MIME_TYPES = List.of(
            "image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4"
    );

    public void validateAssetExists(UUID assetId) {
        if (assetId == null) return;
        assetRepository.findById(assetId)
                .orElseThrow(() -> BusinessException.of(ASSET_NOT_FOUND));
    }

    @Transactional
    public Asset upload(MultipartFile file, AssetFolder folder) {
        validateFile(file);

        try {
            Map<?, ?> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", buildFolderPath(folder),
                            "resource_type", "auto",
                            "quality", "auto",
                            "fetch_format", "auto"
                    )
            );

            Asset asset = Asset.builder()
                    .url((String) result.get("secure_url"))
                    .publicId((String) result.get("public_id"))
                    .fileName(file.getOriginalFilename())
                    .fileSize(file.getSize())
                    .mimeType(file.getContentType())
                    .folder(folder.name())
                    .build();

            log.info("[Media] Uploaded file={} folder={} publicId={}",
                    file.getOriginalFilename(), folder, asset.getPublicId());

            return assetRepository.save(asset);

        } catch (IOException e) {
            log.error("[Media] Upload failed file={}: {}", file.getOriginalFilename(), e.getMessage());
            throw BusinessException.of(ASSET_UPLOAD_FAILED)
                    .withDetail("error: " + e.getMessage());
        }
    }

    @Transactional
    public void delete(UUID assetId) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> BusinessException.of(ASSET_NOT_FOUND));

        try {
            cloudinary.uploader().destroy(
                    asset.getPublicId(),
                    ObjectUtils.asMap("resource_type", resolveResourceType(asset.getMimeType()))
            );

            assetRepository.delete(asset);
            log.info("[Media] Deleted assetId={} publicId={}", assetId, asset.getPublicId());

        } catch (IOException e) {
            log.error("[Media] Delete failed assetId={}: {}", assetId, e.getMessage());
            throw BusinessException.of(ASSET_DELETE_FAILED)
                    .withDetail("error: " + e.getMessage());
        }
    }


    public String getUrl(UUID assetId) {
        if (assetId == null) return null;
        return assetRepository.findById(assetId)
                .map(Asset::getUrl)
                .orElse(null);
    }

    public Map<UUID, String> getUrls(Set<UUID> assetIds) {
        if (CollectionUtils.isEmpty(assetIds)) return Map.of();
        return assetRepository.findAllById(assetIds)
                .stream()
                .collect(Collectors.toMap(Asset::getId, Asset::getUrl));
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty())
            throw BusinessException.of(INVALID_REQUEST)
                    .withDetail("File is required");

        if (file.getSize() > MAX_FILE_SIZE)
            throw BusinessException.of(INVALID_REQUEST)
                    .withDetail("File size exceeds the limit of 10MB");

        if (!ALLOWED_MIME_TYPES.contains(file.getContentType()))
            throw BusinessException.of(INVALID_REQUEST)
                    .withDetail("Unsupported file type");
    }

    private String buildFolderPath(AssetFolder folder) {
        return properties.getFolder() + "/" + folder.name().toLowerCase();
    }

    private String resolveResourceType(String mimeType) {
        if (mimeType == null) return "image";
        return mimeType.startsWith("video") ? "video" : "image";
    }
}
