FROM rust:1.94 as builder

WORKDIR /app

# 1. Copy only dependency manifests
COPY Cargo.toml Cargo.lock ./

# 2. Create dummy main to build deps
RUN mkdir src && echo "fn main() {}" > src/main.rs

# 3. Build dependencies (this layer gets cached)
RUN cargo --version && rustc --version && cargo build --release

# 4. Now copy real source code
COPY src ./src

# Set SQLX to offline mode to avoid trying to connect to the database during build
ENV SQLX_OFFLINE=true
COPY migrations ./migrations
COPY .sqlx ./.sqlx

# 5. Build actual app (fast rebuilds)
RUN cargo build --release

# --- Runtime stage ---
FROM debian:trixie-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y libssl3 \
    && apt-get install -y ca-certificates \
    && apt-get install -y libssl-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN rm ./wondamart_api -f

COPY --from=builder /app/target/release/wondamart_api .

RUN ls -a .

EXPOSE 8080

CMD ["./wondamart_api"]