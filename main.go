package main

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os/exec"
	"runtime"
)

//go:embed dist/*
var content embed.FS

func main() {
	dist, err := fs.Sub(content, "dist")
	if err != nil {
		log.Fatal("Error loading embedded dist directory: ", err)
	}

	port := "8080"
	url := "http://localhost:" + port

	fmt.Println("🚀 Iniciando sistema de Call Center Soft Local en " + url)

	http.Handle("/", http.FileServer(http.FS(dist)))

	go func() {
		// Abrir navegador
		var cmd *exec.Cmd
		switch runtime.GOOS {
		case "windows":
			cmd = exec.Command("cmd", "/c", "start", url)
		case "darwin":
			cmd = exec.Command("open", url)
		default:
			cmd = exec.Command("xdg-open", url)
		}
		if cmd != nil {
			err = cmd.Start()
			if err != nil {
				fmt.Println("Navega manualmente a:", url)
			}
		}
	}()

	fmt.Println("Servidor corriendo. Presiona CTRL+C para cerrar.")
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
