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

## Docker

### Build the image

```bash
docker build -t vabbuo:latest .
```

### Export the image to a tar file

```bash
docker save -o vabbuo.tar vabbuo:latest
```

### Deploy from the tar file

1. Copy `vabbuo.tar` to the target machine 
2. Create a `vabbuo-data` folder, copy there an existing `vabbuo.sqlite` file if available
3. `docker load -i vabbuo.tar`
4. `docker run -d --name vabbuo -p 8282:3000 -v /home/olli/vabbuo-data:/data vabbuo:latest`

Change the 8282 value to the desired port. 
