import React from 'react';
import {Card, Image} from "semantic-ui-react";

export default ({image, title, owner, date, tags, url}) => (
  <Card href={url} target="_blank">
    <Image centered src={image}></Image>
    <Card.Content>
      <Card.Header>{title}</Card.Header>
      <Card.Meta>
        <span>Taken By {owner} on {date}</span>
      </Card.Meta>
    </Card.Content>
    <Card.Content extra className="card-extra">
      <span>{tags}</span>
    </Card.Content>
  </Card>
)