package handlers

import "net/http"

// path=/

func (hc *HandlerContext) Home(res http.ResponseWriter, req *http.Request) {
	res.WriteHeader(200)
	res.Header().Add("content-type", "text/html")
	res.Write([]byte("<html><head></head><body>Deez Nutz</body></html>"))
}
