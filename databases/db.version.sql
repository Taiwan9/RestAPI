--23/03/2024
CREATE TABLE IF NOT exists imagens_produtos (
id_imagens  INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
id_produtos INT,
caminho VARCHAR(255),
FOREIGN KEY (id_produtos) references Produtos(id_produtos)
);