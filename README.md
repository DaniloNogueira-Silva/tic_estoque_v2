# TIC_ESTOQUE - Passo a Passo de como instalar o projeto:

## Iniciando o projeto com o git

1) Crie uma pasta com o nome TIC-ESTOQUE
2) Abre o terminal do VSCODE
3) Digite os seguintes comandos do git:
  - git init
  - git remote add origin https://github.com/DaniloNogueira-Silva/tic_estoque_v2
  - git branch -M main (para verificar se está na branch main)
  - git pull origin main (para trazer todos os arquivos que estão no repositório na núvem)
  - se não der chama o Éder ou o Danilo :)
4) Sempre que adicionar ou alterar algo do projeto, suba as mudanças para o repositório na núvem com git add, git commit e git push

## Iniciando o projeto backend

1) Abre o terminal do VSCODE
2) digite o comando: "npm i" para instalar as depêndencias do projeto
3) digite o comando: "cd src"
4) digite o comando "cd prisma" e crie o arquivo .env
5) O .env deve conter as seguintes informações:

  DATABASE_URL = "file:./dev.db"
  TOKEN_SECRET="dmi390h2nudfwibadhrpfiwbfhivwefvudsajlfadsfa"

6) rodar o comando "npx prisma migrate dev"
7) Use o comando npm run dev no terminal para rodar o projeto backend