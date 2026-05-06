import json
from datetime import datetime, timezone


def lambda_handler(event, context):
    print("Alarma de CloudWatch recibida por NovaCare.")
    print(json.dumps(event, indent=2, ensure_ascii=False))

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "Alarma procesada correctamente.",
            "received_at": datetime.now(timezone.utc).isoformat()
        })
    }
