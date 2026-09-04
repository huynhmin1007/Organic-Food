package com.minn.organicfood.media.controller;

import com.minn.organicfood.media.domain.enums.AssetFolder;
import com.minn.organicfood.media.dto.response.AssetResponse;
import com.minn.organicfood.media.service.MediaService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/media")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MediaController {

    MediaService mediaService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    public AssetResponse upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("folder") String folder
    ) {
        AssetFolder assetFolder = AssetFolder.fromString(folder);
        return AssetResponse.from(mediaService.upload(file, assetFolder));
    }

    @DeleteMapping("/{assetId}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable UUID assetId) {
        mediaService.delete(assetId);
    }
}
