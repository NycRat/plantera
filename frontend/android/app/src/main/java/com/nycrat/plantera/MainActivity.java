package com.nycrat.plantera;

import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

public class MainActivity extends AppCompatActivity {

    protected int count = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    protected void haha() {
        Thread thread = new Thread(() -> {
            try {
                URL url = new URL("http://10.0.2.2:8000/api");
                HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
                try {
                    InputStream in = urlConnection.getInputStream();
                    Scanner scan = new Scanner(in).useDelimiter("\\A");
                    String result = scan.hasNext() ? scan.next() : "NOTHING";
                    System.out.println(result);
                }
                finally {
                    urlConnection.disconnect();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
        thread.start();
    }

    public void onIncrement(View view) {
        TextView titleText = findViewById(R.id.textTitle);
        count++;
        haha();

        titleText.setText("Count: " + count);
    }

    public void onDecrement(View view) {
        TextView titleText = findViewById(R.id.textTitle);
        count--;
        titleText.setText("Count: " + count);
    }
}