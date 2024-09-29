#!/bin/bash

# Find and load environment variables from .env file
if [ -f ".env" ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo "Error: .env file not found"
    exit 1
fi

# Common parameters
fork_url="http://localhost:8545"
private_key="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

# Check if ALCHEMY_API_KEY is set
if [ -z "$ALCHEMY_API_KEY" ]; then
    echo "Error: ALCHEMY_API_KEY is not set in the .env file"
    exit 1
fi

# Check if port 8545 is in use
if lsof -i :8545 > /dev/null 2>&1; then
    echo "Port 8545 is in use. Attempting to kill the process..."

    # Get the PID of the process using port 8545
    PID=$(lsof -t -i :8545)

    # Kill the process
    kill -9 $PID

    echo "Process killed. Waiting a moment before starting Anvil..."
    sleep 2
else
    echo "Port 8545 is free."
fi

anvil --fork-url "https://base-mainnet.g.alchemy.com/v2/$ALCHEMY_API_KEY" --chain-id 1337 &
ANVIL_PID=$!

echo "Waiting for Anvil to start up before running scripts..."
sleep 5 # Wait for 5 seconds

# Change to the contracts directory before running Forge scripts
cd packages/contracts

# Array of scripts to run
scripts=(
    "script/Nom.s.sol:Deploy"
    "script/TraitDeployerManual.s.sol:Deploy"
)

# Loop through the scripts and run them
for script in "${scripts[@]}"; do
    echo "Running $script..."
    forge script "$script" --broadcast --fork-url "$fork_url" --private-key "$private_key"

    # Check if the script ran successfully
    if [ $? -eq 0 ]; then
        echo "$script completed successfully."
    else
        echo "Error: $script failed to run."
        exit 1
    fi

    echo "-----------------------------------"
done

echo "All foundry deploy scripts have been executed."

# Return to the root directory
cd ../..

# Generate ABIs with wagmi
echo "Generating ABIs with wagmi..."
npx wagmi generate

# Check if wagmi generate was successful
if [ $? -eq 0 ]; then
    echo "ABIs generated successfully."
else
    echo "Error: Failed to generate ABIs."
    kill $ANVIL_PID
    exit 1
fi


# Run Ponder indexing service in the background
echo "Starting Ponder indexing service..."
cd packages/ponder && npx ponder dev &
PONDER_PID=$!

# Return to the root directory
cd ../..

# Start Next.js app
echo "Starting Next.js app..."
cd packages/app && npm run dev &
NEXTJS_PID=$!

# Return to the root directory
cd ../..

# Function to handle script termination
cleanup() {
    echo "Terminating Anvil, Ponder, and Next.js app..."
    kill $ANVIL_PID
    kill $PONDER_PID
    kill $NEXTJS_PID
    exit 0
}

# Set up trap to call cleanup function on script termination
trap cleanup SIGINT SIGTERM

echo "Anvil, Ponder, and Next.js app are running. Press Ctrl+C to stop all processes."

# Wait for all processes
wait $ANVIL_PID $PONDER_PID $NEXTJS_PID
