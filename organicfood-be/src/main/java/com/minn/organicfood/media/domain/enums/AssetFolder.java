package com.minn.organicfood.media.domain.enums;

public enum AssetFolder {
    MOVIE, VOUCHER;

    public static AssetFolder fromString(String value) {
        if(value == null)
            return null;

        for(AssetFolder folder : AssetFolder.values()) {
            if(folder.name().equalsIgnoreCase(value))
                return folder;
        }

        throw new IllegalArgumentException("Invalid AssetFolder value: " + value);
    }
}
