package com.reymelin.gradientclock.widget;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.widget.RemoteViews;

import com.reymelin.gradientclock.MainActivity;
import com.reymelin.gradientclock.R;

public class GradientClockWidgetProvider extends AppWidgetProvider {

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        if (WidgetUpdateScheduler.ACTION_AUTO_UPDATE.equals(intent.getAction())) {
            updateAll(context);
            // Re-schedule for another 30 seconds
            WidgetUpdateScheduler.ensureScheduled(context);
        }
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateOne(context, appWidgetManager, appWidgetId);
        }
        WidgetUpdateScheduler.ensureScheduled(context);
    }

    @Override
    public void onAppWidgetOptionsChanged(Context context, AppWidgetManager appWidgetManager, int appWidgetId, Bundle newOptions) {
        super.onAppWidgetOptionsChanged(context, appWidgetManager, appWidgetId, newOptions);
        updateOne(context, appWidgetManager, appWidgetId);
    }

    @Override
    public void onEnabled(Context context) {
        super.onEnabled(context);
        WidgetUpdateScheduler.ensureScheduled(context);
    }

    @Override
    public void onDisabled(Context context) {
        super.onDisabled(context);
        WidgetUpdateScheduler.cancel(context);
    }

    public static void updateAll(Context context) {
        AppWidgetManager mgr = AppWidgetManager.getInstance(context);
        int[] ids = mgr.getAppWidgetIds(new ComponentName(context, GradientClockWidgetProvider.class));
        for (int id : ids) updateOne(context, mgr, id);
    }

    private static void updateOne(Context context, AppWidgetManager mgr, int appWidgetId) {
        Log.d("WidgetProvider", "Updating widget ID: " + appWidgetId);
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.gradient_clock_widget);

        Bundle options = mgr.getAppWidgetOptions(appWidgetId);
        int minW = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH);
        int minH = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT);

        float density = context.getResources().getDisplayMetrics().density;
        int pxW = Math.max(600, (int) (minW * density));
        int pxH = Math.max(600, (int) (minH * density));

        // Use the snapshot logic from GradientRenderer
        Bitmap bmp = GradientRenderer.renderWidgetBitmap(context, pxW, pxH);
        if (bmp != null) {
            views.setImageViewBitmap(R.id.widget_bg, bmp);
        }

        // Setup Click Intent to open the app
        Intent intent = new Intent(context, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        int flags = (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) ? PendingIntent.FLAG_IMMUTABLE : 0;
        PendingIntent pi = PendingIntent.getActivity(context, 0, intent, flags);
        views.setOnClickPendingIntent(R.id.widget_bg, pi);

        mgr.updateAppWidget(appWidgetId, views);
    }
}
