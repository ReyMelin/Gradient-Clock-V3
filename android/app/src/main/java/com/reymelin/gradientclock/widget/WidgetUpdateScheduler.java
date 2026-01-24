package com.reymelin.gradientclock.widget;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

public class WidgetUpdateScheduler {

    public static final String ACTION_AUTO_UPDATE =
            "com.reymelin.gradientclock.widget.ACTION_AUTO_UPDATE";

    public static void ensureScheduled(Context context) {
        AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;

        Intent intent = new Intent(context, GradientClockWidgetProvider.class);
        intent.setAction(ACTION_AUTO_UPDATE);

        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }

        PendingIntent pi = PendingIntent.getBroadcast(context, 0, intent, flags);

        long interval = 90_000L; // 90 seconds (best-effort)
        long triggerAt = System.currentTimeMillis() + interval;

        // ❌ NO exact alarms (prevents crash + policy violations)
        am.set(
                AlarmManager.RTC,
                triggerAt,
                pi
        );

        Log.d("WidgetScheduler", "Best-effort widget update scheduled");
    }

    public static void cancel(Context context) {
        AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;

        Intent intent = new Intent(context, GradientClockWidgetProvider.class);
        intent.setAction(ACTION_AUTO_UPDATE);

        int flags = PendingIntent.FLAG_NO_CREATE;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }

        PendingIntent pi = PendingIntent.getBroadcast(context, 0, intent, flags);
        if (pi != null) {
            am.cancel(pi);
            pi.cancel();
        }
    }
}
