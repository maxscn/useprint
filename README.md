# UsePrint
A modern way to build PDF documents.

## Introduction

UsePrint is for PDFs what react.email is for creating emails. It provides a set of components to compose documents, a preview server, a self-hostable service for generating PDFs.

## Why

There is a lack of libraries for iteratively building PDF documents, without the generation step. The generation step is either done using a library where you directly interact with the PDF standard, which is cumbersome and makes designing beautiful PDFs a pain. The other alternative is to use a headless browser like puppeteer or playwright to make the PDF - UsePrint does this too, but provides a preview UI for you to iterate on your PDFs in real-time.

The closest thing that exists is react-pdf, which is a great library for generating PDFs but with one big caveat: you have to use their React DOM. This means that you cannot use tailwind, regular css or your own custom components. UsePrint allows you to bring your own components to compose your PDFs.
