#lang web-server
;#lang racket

(require web-server/web-server
         web-server/http/bindings
         web-server/dispatch
         web-server/templates
         web-server/http
;         web-server/http/request-strucuts
         json
         net/uri-codec
         net/url)
;(require web-server/)

(require "data.rkt")

(provide interface-version
         start
         servlet-dispatch
	 servlet-url)


(define interface-version 'stateless)

;(define the-board (initialize-board!
;		   (build-path (current-directory)
;			       "board.db")))


; Setup request handlers for various URLs
(define-values (servlet-dispatch servlet-url)
  (dispatch-rules
   [("set-relation") #:method "post" set-relation]
   [("set-karma") #:method "post" set-karma]
   [("upload-file") #:method "post" upload-file]))

; 每个 http 请求 都会经过这里，static的也一样
(define (start request)
  (servlet-dispatch request))



; update relation.json
(define (set-relation request)
  (update-relation (bytes->jsexpr (request-post-data/raw request)))
  (okay-response))


(define (okay-response)
  (response/full 200 #"OK"
                 (current-seconds)
                 TEXT/HTML-MIME-TYPE
                 empty
                 (list #"<html><body>Success: SET-RELATION</body></html>")))




; update karma.json
(define (upload-file request)
  (display "----------------------")
  (newline)
 ; (display request)
  (newline)
  (display (request-post-data/raw request))
  (newline)
  ;; (display
  ;;  (binding:form-value
  ;;           (bindings-assq (string->bytes/utf-8 "fileName")
  ;;                          (request-bindings/raw request)))
  ;;  )
  ;; (newline)
  (let ([file-name (binding:form-value
                    (bindings-assq (string->bytes/utf-8 "fileName")
                                   (request-bindings/raw request)))]
        [file-content (request-post-data/raw request)])
    (display "file-name: ")
    (display file-name)
    (newline)
    (display file-content)
    (newline)
    (display (current-directory))
    (with-output-to-file (bytes->string/utf-8 file-name)
      (lambda ()
        file-content)
      #:exists 'replace))
  ;(display (request-heads/raw request))
;  (display (request-header request))
  ;(update-karma (bytes->jsexpr (request-post-data/raw request)))
  (newline)
  (response/full 200 #"OK"
                 (current-seconds)
                 TEXT/HTML-MIME-TYPE
                 empty
                 (list #"<html><body>Hello, World!</body></html>"))
  )


; update karma.json
(define (set-karma request)
  (display "----------------------")
  ;(newline)
  ;(display "set-karma")
  ;(newline)
  ;(display (request-post-data/raw request))
  (update-karma (bytes->jsexpr (request-post-data/raw request)))
  (newline)
  (response/full 200 #"OK"
                 (current-seconds)
                 TEXT/HTML-MIME-TYPE
                 empty
                 (list #"<html><body>Hello, World!</body></html>")))

; response a http body of json file
(define (response/json js-expr)
  (display 'in-response/json)
  (response/full 200 #"Okay"
                 (current-seconds) #"application/json"
                 empty
                 (list (jsexpr->string js-expr))))

