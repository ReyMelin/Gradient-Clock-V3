package com.reymelin.gradientclock;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Register the Snapshot plugin (auto-registered via @CapacitorPlugin annotation)
        registerPlugin(ClockSnapshotPlugin.class);
    }
}
