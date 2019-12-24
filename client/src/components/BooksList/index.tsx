import React from 'react';
import {UserBook} from "../../model/UserBook";

import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import HighlightOffOutlinedIcon from '@material-ui/icons/HighlightOffOutlined';
import ButtonBase from '@material-ui/core/ButtonBase';
import Rating from '@material-ui/lab/Rating';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 305,
  },
  img: {
    width: 150,
    height: 200,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  tile: {

  },
  tileBar: {
    width: "auto",
    background:
    'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
  },
  delBar: {
    background:
        'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
        'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  delIcon: {
    color: 'white',
  }
}));

interface BooksListProps {
  list: UserBook[],
  handleDelete: (bookId: string) => void
  handleClick: (bookId: string) => void
  handleRating: (bookId: string, newRating: number) => void
}

export const BooksList: React.FC<BooksListProps> = ( {list, handleDelete, handleClick, handleRating} ) => {
  const classes = useStyles();

  return (
      <div  className={classes.root}>
      <GridList
          cellHeight="auto"
          className={classes.gridList}
          cols={2}>
        {list.map(book => (
            <GridListTile key={book.bookId}>

              <ButtonBase>
                <img src={book.coverUrl} alt={book.title} className={classes.img} onClick={ () => {handleClick(book.bookId)} } />
              </ButtonBase>

                <GridListTileBar
                    titlePosition="top"
                    actionIcon={
                      <IconButton className={classes.delIcon} onClick={() => {handleDelete(book.bookId)}} >
                        <HighlightOffOutlinedIcon />
                      </IconButton>
                    }
                    actionPosition="right"
                    className={classes.delBar}
                />

              <GridListTileBar
                  title={book.title}
                  subtitle={
                    <span>
                      <Rating name={"r"+ book.bookId} value={book.rating} size="small"
                              onChange={(e, v) => handleRating(book.bookId, v)}
                      />
                    </span>
                  }
                  className={classes.tileBar}
              />
            </GridListTile>

        ))}
      </GridList>
      </div>
  );
};
