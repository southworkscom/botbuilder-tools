This folder contains several different examples of .lu files. 

## Usage to generate files for LUIS

```bash
ludown parse ToLuis --in ./all.lu -o ./
```

## Usage to generate files for QnA Maker

```bash
ludown parse ToQna --in ./qna1.lu -o ./
```

ludown tool will output:
- LUIS json file if any LUIS concept definitions are found in the .lu file(s)
- QnA json file if any QnAMaker.ai concept definitions are found in the .lu file(s)
