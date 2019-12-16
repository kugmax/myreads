import React from 'react';
import {UserBook} from "../../model/UserBook";

import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
  },
}));

interface BooksListProps {
  list: UserBook[]
}

export const BooksList: React.FC<BooksListProps> = ( {list} ) => {
  const classes = useStyles();

  return (
      <GridList cellHeight={160} className={classes.gridList} cols={1}>
        {list.map(book => (
            <GridListTile key={book.coverUrl} cols={1}>
              <img src={book.coverUrl} alt={book.title} />
            </GridListTile>
        ))}
      </GridList>
  );
};
