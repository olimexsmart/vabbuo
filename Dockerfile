# syntax=docker/dockerfile:1

FROM rust:1.97-alpine AS builder

# Build inside a stable path so the final COPY can target one known location.
WORKDIR /build/vabbuo

RUN apk add --no-cache \
  musl-dev \
  pkgconf \
  sqlite-dev

# Copy the full crate so Cargo has the source, lockfile, and static assets.
COPY Cargo.toml Cargo.lock ./
COPY src ./src
COPY static ./static
COPY favicon.ico ./

RUN cargo build --release --locked

FROM alpine:latest

RUN apk add --no-cache \
  ca-certificates \
  libgcc \
  sqlite-libs \
  # Run the app as a non-root user.
  && addgroup -S vabbuo \
  && adduser -S -G vabbuo vabbuo \
  && mkdir -p /app/static /data \
  && chown -R vabbuo:vabbuo /app /data

WORKDIR /app

# Copy the compiled binary from the builder stage.
COPY --from=builder /build/vabbuo/target/release/vabbuo /app/vabbuo
# Copy the browser assets and favicon the app serves at runtime.
COPY --from=builder /build/vabbuo/static/ /app/static/
COPY --from=builder /build/vabbuo/favicon.ico /app/favicon.ico

# Default runtime config can be overridden with docker run -e ...
ENV DATABASE_URL=sqlite:/data/vabbuo.sqlite
ENV PORT=3000
ENV LICENSE_REFRESH_DAYS=30
ENV MAX_FAILED_ATTEMPTS=5

VOLUME ["/data"]
EXPOSE 3000

USER vabbuo
CMD ["/app/vabbuo"]
