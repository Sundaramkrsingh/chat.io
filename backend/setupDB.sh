echo "=================DB Setup================="

# Defining Default values to variables
docker_running="N"

function migrate_seed_db () {
  echo "=================Migrating DB================="
  migration_output=$(npx prisma migrate dev)

  if [[ $migration_output == *"Running seed command"* ]]; then
    echo "Seeds already applied. Skipping seeding."
  else
    echo "Seeds not applied. Proceeding to seed."
    echo "=================Seeding DB================="
    npx prisma db seed
  fi
}

if [ -f .env ]; then 
    echo ".env file exists"
else 
    echo ".env file does not exist"
    cp .env.example .env
fi 

echo "Setting up Docker"
DATABASE_URL="postgresql://postgres:Latracal@123@localhost:5432/latracal"

echo "DATABASE_URL=\"$DATABASE_URL\"" > .env
docker-compose up -d
if [ $? -eq 0 ]; then
    echo "=================Container is up================="
    sleep 15
else
    echo "Please make sure that docker is running"
    exit 1
fi

migrate_seed_db