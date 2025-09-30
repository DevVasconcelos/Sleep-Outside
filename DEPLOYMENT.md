# GitHub Pages Deployment Guide

## ✅ Status: Repositório Público - GitHub Pages Habilitado

**IMPORTANTE**: GitHub Pages só funciona em repositórios públicos ou com GitHub Pro/Team. 
Este repositório agora está público e pronto para deployment!

**PROBLEMA ATUAL**: O site está servindo o README.md em vez do index.html da pasta dist. 
Isso indica que o GitHub Pages não está configurado para usar a branch gh-pages.

## Método Atual: Deployment via gh-pages branch

Este projeto usa a action `peaceiris/actions-gh-pages` que:
- ✅ Cria automaticamente a branch `gh-pages`
- ✅ Habilita o GitHub Pages automaticamente  
- ✅ Funciona perfeitamente com repositórios públicos
- ✅ Deploy automático a cada push na branch `main`

## Como funciona
1. A cada push na branch `main`, o workflow:
   - Instala dependências
   - Executa o build (`npm run build`)
   - Faz deploy do conteúdo da pasta `dist/` para a branch `gh-pages`
   - GitHub Pages serve automaticamente da branch `gh-pages`

## Se ainda houver problemas

### Verificar se o Pages foi habilitado automaticamente
1. Vá para o repositório no GitHub
2. Clique em **Settings**
3. No menu lateral, clique em **Pages**
4. Deveria mostrar:
   - **Source**: Deploy from a branch
   - **Branch**: gh-pages / (root)

### Se a configuração não apareceu automaticamente
1. Em **Settings > Pages**
2. Em **Source**, selecione **Deploy from a branch**
3. Em **Branch**, selecione **gh-pages** e **/root**
4. Clique **Save**

## URL do site após deployment
Após o deployment bem-sucedido, o site estará disponível em:
`https://lubias.github.io/teste/`

## Estrutura do projeto
- O build é gerado na pasta `dist/`
- O arquivo `vite.config.js` está configurado com `base: "/teste/"` para o GitHub Pages
- O workflow faz deploy automático a cada push na branch `main`