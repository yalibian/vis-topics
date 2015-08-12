#lang web-server

(require json)

(provide getJSON)


 ;(jsexpr? 'null)


; response a http body of json file
(define (response/json js-expr)
  (display 'in-response/json)
  (response/full 200 #"Okay"
                 (current-seconds) #"application/json"
                 empty
                 (list (jsexpr->string js-expr))))




(define JSON (jsexpr->string (hasheq 'ip-address "10.15.62.221"
                         'hello "yes you can")))

(define getJSON (lambda (request file-name)
                  (println file-name)
                  (response/full 200 #"OK"
                                 (current-seconds)
                                 #"application/json"
                                 empty
                                 (list
                                  (string->bytes/utf-8 JSON)))))
