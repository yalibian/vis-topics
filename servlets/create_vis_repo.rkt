#lang web-server


(provide upload-files)



(define upload-files (lambda (request)
                       (let ([bindings (request-bindings/raw request)])
                         (let ([file-name (binding:form-value (bindings-assq
                                                               (string->bytes/utf-8 "file-name")
                                                               bindings))]
                               [file-content (request-post-data/raw request)]
                               [time-stamp (binding:form-value (bindings-assq
                                                                 (string->bytes/utf-8 "timestamp")
                                                                 bindings))]
                               [ip-address (request-host-ip request)])
                           (println time-stamp)
                           (save-file (string-append ip-address (bytes->string/utf-8 time-stamp))
                                      (bytes->string/utf-8 file-name)
                                      file-content)
                           (okay-response)))))

(define (create-vis-repo vis-id)

  ; copy all the frontend files from static directory, to the vis-id

  (copy-directory/files
   "static/template"
   vis-id)

  'ok)

(define save-file (lambda (dir file-name file-content)


                    ; make directory "dir" in current-directory + "vis-repo", put the file into this dire

                    (unless (member (string->path dir) (directory-list "static/vis-repo"))
                      (create-vis-repo
                       (string-append "static/vis-repo/" dir)))

                    (display-to-file file-content
                                     (string-append "static/vis-repo/" dir "/data/" file-name )
                                     #:mode 'binary
                                     #:exists 'replace)

                    ;; (display-to-file (bytes->string/utf-8 file-content) (string-append "vis-repo/" dir "/" file-name)
                    ;;                #:mode 'text
                    ;;                #:exists 'replace)


                    ))

 ;                   (with-output-to-file (string-append "vis-repo/" dir "/" file-name) (lambda ()
 ;                                                                                        file-content)
 ;                     #:exists 'replace)



(define (okay-response)
  (response/full 200 #"OK"
                 (current-seconds)
                 TEXT/HTML-MIME-TYPE
                 empty
                 (list #"<html><body>Success: SET-RELATION</body></html>")))
