#lang racket
(require web-server/http)

(provide vis-download)


(define vis-download (lambda (request vis_id)
                       (display "vis_id")
                       (okay-response)))


(define (okay-response)
  (response/full 200 #"OK"
                 (current-seconds)
                 TEXT/HTML-MIME-TYPE
                 empty
                 (list #"<html><body>Success: SET-RELATION</body></html>")))
