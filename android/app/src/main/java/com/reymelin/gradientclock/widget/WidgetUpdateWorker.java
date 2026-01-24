package com.reymelin.gradientclock.widget;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

public class WidgetUpdateWorker extends Worker {

  public WidgetUpdateWorker(@NonNull Context context, @NonNull WorkerParameters params) {
    super(context, params);
  }

  @NonNull
  @Override
  public Result doWork() {
    GradientClockWidgetProvider.updateAll(getApplicationContext());
    return Result.success();
  }
}
