package com.minn.organicfood.shared.utils;

import java.security.SecureRandom;

public class OtpUtils {

    public static String generateOtp() {
        SecureRandom random = new SecureRandom();
        return String.format("%06d", random.nextInt(999999));
    }
}
