# Runtime validation status

The project runtime checks remain pending. Docker Desktop is installed, but neither the `desktop-linux` endpoint (`npipe:////./pipe/dockerDesktopLinuxEngine`) nor the default endpoint (`npipe:////./pipe/docker_engine`) is available. A local start request was denied by the host environment, so this task cannot start the Docker service itself.

The host checks also found no listening PostgreSQL port on 5432 and no reachable backend on localhost:8000.

Static checks remain the authoritative validation until Docker is available:

- source-cache integrity: passed
- target-mode asset gate: passed
- food image audit: passed
- catalog baseline: 846 foods, no missing serving/search fields

Once Docker Desktop is started by the user or host environment, rerun the project compose stack and then verify PostgreSQL seed synchronization, `/food/search`, and both client runtimes.

The catalog was subsequently corrected for eight deterministic brand fields (`food_id` 199-206). The JSON parses successfully, but the required backend container seed synchronization is still pending for the same Docker availability reason.
