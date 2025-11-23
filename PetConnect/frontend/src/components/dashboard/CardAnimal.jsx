import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { useEffect, useState } from "react";

const ExpandMore = styled((props) => {
  const { ...other } = props;
  return <IconButton {...other} />;
})(
  ({ theme }) => ({
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    transform: 'rotate(0deg)',
  })
);

// El component ara rep també la info de la protectora via props (simulant la futura connexió amb Django REST Framework)
// protectora = { nombre: string, foto: string }

export default function CardAnimal({ itemData, protectora }) {
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const animalsToShow = itemData || [];
  // Si no hi ha protectora, mostrar valors per defecte
  const protectoraNom = protectora?.nombre || "Nom Protectora";
  const protectoraFoto = protectora?.foto || undefined;
  
  return (
    <div>
      {animalsToShow.map((animal) => {
        const nombre = animal.nombre || "Nombre";
        const descripcion = animal.descripcion || "Així es mostrarà la descripció";
        const especie = animal.especie || "Espècie";
        const genero = animal.genero || "Gènere";
        const edad = animal.edad || "0";
        const ubicacion = animal.ubicacion || "Ciutat";
        const tamaño = animal.tamaño || "Mida";
        const peso = animal.peso || "Pes";
        const color = animal.color || "Color";
        const convivencia_animales = animal.convivencia_animales || "No especificat";
        const convivencia_ninos = animal.convivencia_ninos || "No especificat";
        const caracter = animal.caracter && animal.caracter.length > 0 ? animal.caracter.join(", ") : "No especificat";
        return (
          <Card key={animal.id} sx={{ maxWidth: 345 }}>
            <CardHeader
              avatar={<Avatar sx={{ bgcolor: red[500] }} src={protectoraFoto} />}
              title={protectoraNom}
              subheader={`${edad} anys - ${ubicacion}`}
            />
            <CardMedia component="img" height="194" image={animal.foto} />
            <CardContent>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {nombre}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <IconButton aria-label="add to favorites">
                <FavoriteIcon />
              </IconButton>
              <IconButton aria-label="share">
                <ShareIcon />
              </IconButton>
              <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography sx={{ marginBottom: 2 }} variant="subtitle1">
                  Detalls:
                </Typography>
                <Typography sx={{ marginBottom: 2 }}>
                  <b>Descripció:</b> {descripcion}
                </Typography>
                <Typography sx={{ marginBottom: 2 }}>
                  <b>Espècie:</b> {especie} &nbsp;
                  <b>Gènere:</b> {genero} &nbsp;
                  <b>Edat:</b> {edad} anys
                </Typography>
                <Typography sx={{ marginBottom: 2 }}>
                  <b>Mida:</b> {tamaño} &nbsp;
                  <b>Pes:</b> {peso} kg &nbsp;
                  <b>Color:</b> {color}
                </Typography>
                <Typography sx={{ marginBottom: 2 }}>
                  <b>Necessitats especials:</b> {animal.necesidades_especiales ? "Sí" : "No"}
                  {animal.necesidades_especiales && (
                    <>
                      <br />
                      <b>Descripció:</b> {animal.descripcion_necesidades}
                    </>
                  )}
                </Typography>
                <Typography sx={{ marginBottom: 2 }}>
                  <b>Convivència amb altres animals:</b> {convivencia_animales}
                  <br />
                  <b>Convivència amb nens:</b> {convivencia_ninos}
                </Typography>
                <Typography sx={{ marginBottom: 2 }}>
                  <b>Caràcter:</b> {caracter}
                </Typography>
              </CardContent>
            </Collapse>
          </Card>
        );
      })}
    </div>
  );
}