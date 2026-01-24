package com.reymelin.gradientclock.widget;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

public class WidgetUpdateScheduler {
    public static final String ACTION_AUTO_UPDATE = "com.reymelin.gradientclock.widget.ACTION_AUTO_UPDATE";

    public static void ensureScheduled(Context context) {
        AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        Intent intent = new Intent(context, GradientClockWidgetProvider.class);
        intent.setAction(ACTION_AUTO_UPDATE);
        
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }
        
        PendingIntent pi = PendingIntent.getBroadcast(context, 0, intent, flags);
        
        // 90 seconds interval
        long interval = 90 * 1000;
        long triggerAt = System.currentTimeMillis() + interval;
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pi);
        } else {
            am.setExact(AlarmManager.RTC_WAKEUP, triggerAt, pi);
        }
        Log.d("WidgetScheduler", "Next update scheduled in 90 seconds");
    }

    public static void cancel(Context context) {
        AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
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
