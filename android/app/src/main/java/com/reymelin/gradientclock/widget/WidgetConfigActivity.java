package com.reymelin.gradientclock.widget;

import android.app.Activity;
import android.appwidget.AppWidgetManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.RadioGroup;

import com.reymelin.gradientclock.R;

public class WidgetConfigActivity extends Activity {

    private int appWidgetId = AppWidgetManager.INVALID_APPWIDGET_ID;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Set the result to CANCELED. This will cause the widget host to cancel
        // out of the widget placement if the user presses the back button.
        setResult(RESULT_CANCELED);

        setContentView(R.layout.widget_config);

        // Find the widget id from the intent.
        Intent intent = getIntent();
        Bundle extras = intent.getExtras();
        if (extras != null) {
            appWidgetId = extras.getInt(
                    AppWidgetManager.EXTRA_APPWIDGET_ID, AppWidgetManager.INVALID_APPWIDGET_ID);
        }

        // If this activity was started with an invalid widget ID, finish with an error.
        if (appWidgetId == AppWidgetManager.INVALID_APPWIDGET_ID) {
            finish();
            return;
        }

        findViewById(R.id.confirm_button).setOnClickListener(v -> {
            final Context context = WidgetConfigActivity.this;

            // Save configuration to SharedPreferences
            RadioGroup themeGroup = findViewById(R.id.theme_group);
            int selectedThemeId = themeGroup.getCheckedRadioButtonId();
            View selectedTheme = findViewById(selectedThemeId);
            String themeTag = selectedTheme != null ? (String) selectedTheme.getTag() : "metallic";

            RadioGroup formatGroup = findViewById(R.id.time_format_group);
            int selectedFormatId = formatGroup.getCheckedRadioButtonId();
            View selectedFormat = findViewById(selectedFormatId);
            String formatTag = selectedFormat != null ? (String) selectedFormat.getTag() : "ampm";

            savePrefs(context, appWidgetId, themeTag, formatTag);

            // It is the responsibility of the configuration activity to update the app widget
            AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
            GradientClockWidgetProvider.updateAll(context);

            // Make sure we pass back the original appWidgetId
            Intent resultValue = new Intent();
            resultValue.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);
            setResult(RESULT_OK, resultValue);
            finish();
        });
    }

    private void savePrefs(Context context, int appWidgetId, String theme, String format) {
        SharedPreferences.Editor prefs = context.getSharedPreferences("WidgetPrefs", 0).edit();
        prefs.putString("theme_" + appWidgetId, theme);
        prefs.putString("format_" + appWidgetId, format);
        prefs.apply();
    }
}
