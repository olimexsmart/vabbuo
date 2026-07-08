# vabbuo.it

Small sentence site rewritten as a Rust + SQLite app.

## Run

```bash
cargo run
```

The server listens on `http://127.0.0.1:3000` by default.

### Configuration

- `DATABASE_URL=sqlite://vabbuo.sqlite`
- `PORT=3000`

The database file is created automatically on first start and seeded with a
small fallback sentence list if the table is empty.
