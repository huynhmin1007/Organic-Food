package com.minn.organicfood.media.dto.response;

import com.minn.organicfood.media.domain.Asset;
import lombok.Builder;

import java.util.UUID;

@Builder
public record AssetResponse(
        UUID id,
        String url,
        String fileName,
        Long fileSize,
        String mimeType,
        String folder
) {
    public static AssetResponse from(Asset asset) {
        return AssetResponse.builder()
                .id(asset.getId())
                .url(asset.getUrl())
                .fileName(asset.getFileName())
                .fileSize(asset.getFileSize())
                .mimeType(asset.getMimeType())
                .folder(asset.getFolder())
                .build();
    }
}
