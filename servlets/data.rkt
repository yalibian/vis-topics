#lang racket

; 实现功能： 维护 两个　json 文件： relation / karma
; 对relation karma 从 文件中读取到内存
; 更新信息到文件中
;


(require json
         racket/file)

(provide (all-defined-out))

; file-path -> js-expr
;(define (read-json-from-file file-path)
;  (string->jsexpr (file->string file-path)))

; write js-expression into a file
(define (write-json-to-file file-path js-expr)
  (newline)
  (display "in write-json-to-file")
  (newline)
  (call-with-output-file file-path
    (lambda (out)
      (write-json js-expr out))
    #:exists 'replace))

(define (write-string-to-file file-path str)
  (call-with-output-file file-path
    (lambda (out)
      (write str out))
    #:exists 'replace
    #:mode 'text))


;;--------------------------------------------------------------;;
;; relation
;;--------------------------------------------------------------;;

(define relation-path (build-path (current-directory) "static/data/relation.json"))

(define (update-relation js-expr)
  (write-json-to-file relation-path js-expr))



;;--------------------------------------------------------------;;
;; karma
;;--------------------------------------------------------------;;

(define karma-path (build-path (current-directory) "static/data/karma.json"))

(define (update-karma js-expr)
  (newline)
  (display "update karma with js-expr")
  (newline)
  (display "js-expr: ")
  (display js-expr)
  (write-json-to-file karma-path js-expr))
