# Monitoring & Observability Setup Guide

This document explains how to set up and configure Prometheus, New Relic, and Sentry for your Django portfolio application.

---

## 1. PROMETHEUS (Metrics & Monitoring)

### Overview
Prometheus is used to collect and visualize application metrics. It exposes metrics in Prometheus format at `/metrics/` endpoint.

### Setup

1. **Metrics are automatically collected** - The `django-prometheus` package automatically collects:
   - Request/response times
   - Database query counts
   - Cache hits/misses
   - HTTP status codes
   - Request sizes

2. **Access Prometheus Metrics**
   ```
   http://localhost:8000/metrics/
   ```
   This endpoint exposes metrics in Prometheus format.

3. **Install Prometheus Server** (for metrics visualization)
   ```bash
   # On macOS
   brew install prometheus
   
   # On Linux (Ubuntu/Debian)
   sudo apt-get install prometheus
   ```

4. **Configure Prometheus** (`/etc/prometheus/prometheus.yml`)
   ```yaml
   global:
     scrape_interval: 15s
   
   scrape_configs:
     - job_name: 'django_app'
       static_configs:
         - targets: ['localhost:8000']
       metrics_path: '/metrics/'
   ```

5. **Run Prometheus**
   ```bash
   prometheus --config.file=/etc/prometheus/prometheus.yml
   ```

6. **View Metrics Dashboard**
   Open http://localhost:9090 in your browser

### Custom Metrics (Advanced)
To add custom metrics in your views or models:

```python
from django_prometheus.models import model_helpers

# Add to your model's save() method or a signal
model_helpers.model_watch_handler(YourModel, 'custom_metric_name')
```

---

## 2. SENTRY (Error Tracking & Crash Reporting)

### Overview
Sentry captures and tracks errors, exceptions, and performance issues in real-time.

### Setup

1. **Create Sentry Account**
   - Go to https://sentry.io/
   - Sign up for a free account
   - Create a new project for "Django"

2. **Get Your DSN**
   - After creating the project, you'll receive a Sentry DSN (example):
   ```
   https://examplePublicKey@o0.ingest.sentry.io/0
   ```

3. **Configure Environment Variables** (in `.env`)
   ```
   SENTRY_ENABLED=True
   SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
   SENTRY_TRACES_SAMPLE_RATE=0.1
   ENVIRONMENT=production
   ```

4. **Verify Setup**
   ```bash
   python manage.py shell
   >>> import sentry_sdk
   >>> sentry_sdk.capture_message("Hello Sentry!")
   # Check your Sentry dashboard - you should see this message
   ```

5. **Test Error Capture**
   Create a test view to verify errors are being captured:
   ```python
   # In your urls.py
   urlpatterns = [
       path('test-sentry/', lambda r: 1/0),  # Intentional error
   ]
   ```
   Visit `http://localhost:8000/test-sentry/` and check your Sentry dashboard.

### Features
- **Error Alerts**: Get notifications when errors occur
- **Performance Monitoring**: Track slow requests (enabled by `traces_sample_rate`)
- **Release Tracking**: Link errors to specific releases
- **Breadcrumbs**: Track user actions leading to errors
- **Source Maps**: Map minified JavaScript back to original code

### Advanced Configuration
In `config/settings/base.py`, you can customize Sentry:

```python
SENTRY_DSN = os.getenv('SENTRY_DSN')
SENTRY_ENABLED = os.getenv('SENTRY_ENABLED', 'False').lower() == 'true'

if SENTRY_ENABLED and SENTRY_DSN:
    import sentry_sdk
    from sentry_sdk.integrations.django import DjangoIntegration
    from sentry_sdk.integrations.celery import CeleryIntegration
    from sentry_sdk.integrations.redis import RedisIntegration
    
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        integrations=[
            DjangoIntegration(),
            CeleryIntegration(),  # For async tasks
            RedisIntegration(),   # For cache issues
        ],
        traces_sample_rate=0.1,        # 10% of transactions sampled
        profiles_sample_rate=0.1,      # 10% of profiles sampled
        send_default_pii=False,        # Don't send PII data
        environment=os.getenv('ENVIRONMENT', 'development'),
        # Custom before_send to filter errors
        before_send=lambda event, hint: event if 'admin' not in event.get('request', {}).get('url', '') else None,
    )
```

---

## 3. NEW RELIC (APM & Application Performance Monitoring)

### Overview
New Relic provides comprehensive application performance monitoring, including:
- Transaction tracing
- Database monitoring
- Error tracking
- Real-time alerts
- Infrastructure monitoring

### Setup

1. **Create New Relic Account**
   - Go to https://newrelic.com/
   - Sign up for a free account
   - Create a new application

2. **Get Your License Key**
   - From your New Relic account, get your **License Key** (found in Settings → API keys)

3. **Configure Environment Variables** (in `.env`)
   ```
   NEW_RELIC_LICENSE_KEY=your-license-key-here
   NEW_RELIC_ENVIRONMENT=production
   NEW_RELIC_CONFIG_FILE=newrelic.ini
   ```

4. **Option A: Using newrelic-admin wrapper** (Recommended for production)
   
   Run your app with the New Relic admin wrapper:
   ```bash
   newrelic-admin run-program python manage.py runserver
   ```
   
   Or for production with Gunicorn:
   ```bash
   newrelic-admin run-program gunicorn config.wsgi:application
   ```

5. **Option B: Manual Initialization** (For WSGI apps)
   
   Add to your `config/wsgi.py`:
   ```python
   import newrelic.agent
   
   newrelic_config_file = os.getenv('NEW_RELIC_CONFIG_FILE', 'newrelic.ini')
   newrelic.agent.initialize(newrelic_config_file, os.getenv('NEW_RELIC_ENVIRONMENT', 'development'))
   
   from django.core.wsgi import get_wsgi_application
   application = newrelic.agent.wsgi_application()(get_wsgi_application())
   ```

6. **Verify in Web UI**
   - Log into https://one.newrelic.com/
   - Navigate to APM → Your Application
   - You should see transactions, errors, and performance data

### Key Features
- **Transaction Overview**: See slowest transactions
- **Database Monitoring**: Track database query performance
- **Error Analytics**: Detailed error tracking with stack traces
- **Real-time Alerts**: Set up notifications for performance degradation
- **Custom Events**: Track business metrics
- **Infrastructure**: Monitor server/container performance

### Custom Instrumentation

Add custom monitoring to specific functions:

```python
import newrelic.agent

@newrelic.agent.function_trace(name='expensive_operation', group='Custom')
def expensive_function():
    # Your code here
    pass

# Or record custom metrics
newrelic.agent.record_custom_metric('Custom/MyMetric', value)
```

### Configuration File
The `newrelic.ini` file includes configuration for:
- Application name
- License key
- Environment
- Logging
- Transaction tracing
- Error collection
- Browser monitoring

---

## Environment Variables Summary

Create/update your `.env` file:

```bash
# Sentry
SENTRY_ENABLED=True
SENTRY_DSN=https://your-key@o0.ingest.sentry.io/0
SENTRY_TRACES_SAMPLE_RATE=0.1

# New Relic
NEW_RELIC_LICENSE_KEY=your-license-key
NEW_RELIC_ENVIRONMENT=production
NEW_RELIC_CONFIG_FILE=newrelic.ini

# General
ENVIRONMENT=production
```

---

## Monitoring Dashboard Setup

### Combined Monitoring Stack

For a complete observability setup, use these tools together:

```
┌─────────────────────────────────────────────────────────┐
│                  Your Django App                         │
├─────────────────────────────────────────────────────────┤
│  ✓ Prometheus Metrics → /metrics/ endpoint               │
│  ✓ Sentry Error Tracking → Real-time alerts             │
│  ✓ New Relic APM → Transaction tracing                  │
│  ✓ Celery Tasks → Monitoring via New Relic             │
└─────────────────────────────────────────────────────────┘
```

### Recommended Workflow

1. **Development**
   - Set `SENTRY_ENABLED=False` (or use Sentry free tier)
   - Use local Prometheus instance
   - Skip New Relic or use free tier

2. **Staging**
   - Enable all three tools
   - Use staging DSN for Sentry
   - Use staging environment in New Relic

3. **Production**
   - Full production monitoring
   - Set appropriate sample rates (0.1 = 10%)
   - Enable alerting in both Sentry and New Relic

---

## Troubleshooting

### Prometheus Issues
- **Metrics not showing**: Check `/metrics/` endpoint is accessible
- **High memory usage**: Disable unused metrics in settings
- **Connection timeout**: Verify firewall allows port 9090

### Sentry Issues
- **Event not appearing**: Check SENTRY_ENABLED=True and valid DSN
- **High quota usage**: Reduce SENTRY_TRACES_SAMPLE_RATE
- **Missing errors**: Verify integration is properly initialized

### New Relic Issues
- **No data appearing**: Verify license key is correct
- **Slow to load transactions**: Check transaction_tracer settings in newrelic.ini
- **High CPU usage**: Reduce sampling rates or disable certain integrations

---

## Additional Resources

- Prometheus Docs: https://prometheus.io/docs/
- Sentry Docs: https://docs.sentry.io/
- New Relic Docs: https://docs.newrelic.com/
- django-prometheus: https://github.com/korfuri/django-prometheus

---

## Next Steps

1. ✅ Install packages (already done)
2. ✅ Configure settings (already done)
3. ✅ Set up environment variables (see `.env.example`)
4. Update your `.env` file with actual API keys
5. Test each monitoring tool
6. Set up alerts in Sentry and New Relic
7. Implement custom metrics as needed
