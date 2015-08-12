#lang web-server
;#lang racket

(require ;web-server/web-server
         ;web-server/http/bindings
         ;web-server/dispatch
         ;web-server/templates
         ;web-server/http
;         web-server/http/request-strucuts
         json
         net/uri-codec
         net/url)
;(require web-server/)

(require "data.rkt")
(require "vis_serve.rkt")
(require "vis_download.rkt"
         "create_vis_repo.rkt")

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
   [("upload") #:method "post" upload]
   [("upload-file") #:method "post" upload-file]
   [("upload-files") #:method "post" upload-files]
   [("get-ip") #:method (or "get" "post") get-ip]
   [("serve" (string-arg)) vis-serve]
   [("download" (string-arg)) #:method (or "get" "post") vis-download]
   ))

; 每个 http 请求 都会经过这里，static的也一样
(define (start request)
  (servlet-dispatch request))


(define upload (lambda (request)
                 ;(println "in upload")
                 (response/full 200 #"OK"
                                (current-seconds)
                                TEXT/HTML-MIME-TYPE
                                empty
                                (list #"<html><body>Success: SET-RELATION</body></html>"))))


(define get-ip (lambda (request)
                 ;(println "in get-ip")
                  (response-json (hasheq
                                  'ip_address (request-host-ip request)
                                  'hello "yes you can"))))

(define response-json (lambda (o)
                        (response/output (lambda (op)
                                           (write-json o op))
                                         #:mime-type #"application/javascript")))



(define (okay-response)
  (response/full 200 #"OK"
                 (current-seconds)
                 TEXT/HTML-MIME-TYPE
                 empty
                 (list #"<html><body>Success: SET-RELATION</body></html>")))


(define (okay-response-1)
  (response/full 200 #"OK"
                 (current-seconds)
                 TEXT/HTML-MIME-TYPE
                 empty
                 (list #"200")))




; update karma.json
(define (upload-file request)
  ;(display "----------------------")
  (newline)
 ; (display request)
  (newline)
  ;(display (request-post-data/raw request))
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
    ;(display "file-name: ")
    ;(display file-name)
    ;(newline)
    ;(display file-content)
    ;(newline)
    ;(display (current-directory))
    (with-output-to-file (bytes->string/utf-8 file-name)
      (lambda ()
        file-content)
      #:exists 'replace))
  ;(display (request-heads/raw request))
;  (display (request-header request))
  ;(update-karma (bytes->jsexpr (request-post-data/raw request)))
  ;(newline)
  (response/full 200 #"OK"
                 (current-seconds)
                 TEXT/HTML-MIME-TYPE
                 empty
                 (list #"<html><body>Hello, World!</body></html>"))
  )


;; ; update karma.json
;; (define (set-karma request)
;;   (display "----------------------")
;;   ;(newline)
;;   ;(display "set-karma")
;;   ;(newline)
;;   ;(display (request-post-data/raw request))
;;   (update-karma (bytes->jsexpr (request-post-data/raw request)))
;;   (newline)
;;   (response/full 200 #"OK"
;;                  (current-seconds)
;;                  TEXT/HTML-MIME-TYPE
;;                  empty
;;                  (list #"<html><body>Hello, World!</body></html>")))

;; ; response a http body of json file
;; (define (response/json js-expr)
;;   (display 'in-response/json)
;;   (response/full 200 #"Okay"
;;                  (current-seconds) #"application/json"
;;                  empty
;;                  (list (jsexpr->string js-expr))))

