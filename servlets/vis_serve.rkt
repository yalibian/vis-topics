#lang racket

(require web-server/http)
(provide vis-serve)

(define vis-serve (lambda (request id-vis)
                    ;(display request)
;                    (display id-vis)
                    (okay-response)))


(define (okay-response)
  (response/full 200 #"OK"
                 (current-seconds)
                 TEXT/HTML-MIME-TYPE
                 empty
                 (list #"<html><body>Success: SET-RELATION</body></html>")))
