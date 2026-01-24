package com.reymelin.gradientclock.widget;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class TimeFormatter {
    public static String format(String type) {
        String pattern;
        switch (type != null ? type : "ampm") {
            case "military":
                pattern = "HH:mm";
                break;
            case "none":
                return "";
            case "ampm":
            default:
                pattern = "h:mm";
                break;
        }
        return new SimpleDateFormat(pattern, Locale.getDefault()).format(new Date());
    }
}
