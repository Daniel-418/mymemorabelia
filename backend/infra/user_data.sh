sudo apt update
sudo apt upgrade -y
sudo apt install -y nginx
sudo apt install -y docker.io docker-compose-v2 nginx git certbot python3-certbot-nginx awscli jq

PARAMS=(
	"DATABASE_URL"
	"POSTGRES_USER"
	"POSTGRES_PASSWORD"
	"POSTGRES_DB"
	"ENV"
	"DJANGO_SECRET_KEY"
	"DJANGO_ALLOWED_HOSTS"
	"AWS_STORAGE_BUCKET_NAME"
	"AWS_S3_CUSTOM_DOMAIN"
	"AWS_S3_DEFAULT_REGION"
	"AWS_S3_SIGNATURE_VERSION"
	"AWS_ACCESS_KEY_ID"
	"AWS_SECRET_ACCESS_KEY"
	"AWS_S3_REGION_NAME"
	"EMAIL_HOST"
	"EMAIL_PORT"
	"EMAIL_HOST_USER"
	"EMAIL_HOST_PASSWORD"
	"DEFAULT_FROM_EMAIL"
)

>/home/ubuntu/.env

echo "Fetching parameters from AWS SSM..."

for param in "${PARAMS[@]}"; do
	VALUE=$(aws ssm get-parameter \
		--name "/mymemorabelia/dev/$param" \
		--with-decryption \
		--query "Parameter.Value" \
		--output text)

	if [ "$VALUE" != "None" ] && [ ! -z "$VALUE" ]; then
		echo "$param=$VALUE" >>/home/ubuntu/.env
		echo "Successfully fetched $param"
	else
		echo "WARNING: Could not fetch $param"
	fi
done

chown ubuntu:ubuntu /home/ubuntu/.env
chmod 600 /home/ubuntu/.env
