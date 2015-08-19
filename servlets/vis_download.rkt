#lang racket
(require web-server/http
         file/zip)

(provide vis-download)


(define vis-download (lambda (request vis-id)
                       ;(display "vis_id")
                       (println "In vis-download")
                       ; zip the id directory
                       (zip (string-append "static/download-repo/" vis-id ".zip") (string-append "static/vis-repo/" vis-id))
                       ;(string-append "static/vis-repo/" dir "/data/" file-name )
                       (response/blob vis-id)))



; response a http body of json file
(define (response/blob file-id)
  (display "in response/blob")
  (response/full 200 #"Okay"
                 (current-seconds)
                 #"application/octet-stream"
                 empty
                 (list ;(bytes->string/utf-8
                        (file->bytes (string-append "static/download-repo/" file-id ".zip")))));)



;;(define (okay-response)
  ;; (response/full 200 #"OK"
  ;;                (current-seconds)
  ;;                #"application/octet-stream"
  ;;                empty
  ;;                (list
  ;;                 (read-file)
  ;;                 )))


;(make #:url->path url->path)
