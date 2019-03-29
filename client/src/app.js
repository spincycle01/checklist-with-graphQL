import React, { Component } from 'react';
import gql from 'graphql-tag';  //parsing GraphQL queries
import { graphql, compose } from 'react-apollo'; //bind it with component
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import Form from './form';

//take query from graphQL, string template calling, passing to function
const TodosQuery = gql`{
  todos {
    id
    text
    complete
  }
}
`;
//variables in graphQL need $, ! means they are mandatory
const CreateTodoMutation = gql`
  mutation($text: String!) {
    createTodo (text: $text) {
      id
      text
      complete
    }
  }
`;

const UpdateMutation = gql`
mutation($id: ID!, $complete: Boolean!) {
  updateTodo (id: $id, complete: $complete)
}
`;

const RemoveMutation = gql`
mutation($id: ID!) {
  removeTodo(id: $id)
}
`;

//storing everything in mongodb, it is our state, so do not need state here
//fetching everything with graphQL
class App extends Component {
  //setting up three functions
  createTodo = async text => {
    //create todo
    await this.props.createTodo ({
    variables: {
      text
    },//store is the cache, data is our data added, pass in mutation
    update: (store, { data: { createTodo } }) => {
      // Read the data from our cache for this query.
      const data = store.readQuery({ query: TodosQuery });
      // Add our comment from the mutation to the end.
      data.todos.push(createTodo)
      // Write our data back to the cache.
      store.writeQuery({ query: TodosQuery, data });
    }
  })
  }

  updateTodo = async todo => {
    //update todo
    await this.props.updateTodo({
      variables: {
        id: todo.id,
        complete: !todo.complete
      },//store is the cache, data is our data added, pass in mutation
      update: store => {
        // Read the data from our cache for this query.
        const data = store.readQuery({ query: TodosQuery });
        // Add our comment from the mutation to the end.
        data.todos = data.todos.map(x => 
          x.id === todo.id ? { ...todo, complete: !todo.complete} : x );
        // Write our data back to the cache.
        store.writeQuery({ query: TodosQuery, data });
      }
    })
  };
  removeTodo = async todo => {
    //remove todo
    await this.props.removeTodo({
      variables: {
        id: todo.id
      },//store is the cache, data is our data added, pass in mutation
      update: store => {
        // Read the data from our cache for this query.
        const data = store.readQuery({ query: TodosQuery });
        // Remove item from store with filter
        //if ids don't match, keep them
        data.todos = data.todos.filter(x => x.id !== todo.id);
        // Write our data back to the cache.
        store.writeQuery({ query: TodosQuery, data });
      }
    })
  };
  
  render() {

    console.log(this.props)
    //destructure the props
    const { data: {loading, todos}} = this.props;
    if (loading) {
      return null;
    }
    return (
      <div style={{ display: 'flex' }}>
        <div style={{margin: 'auto', width: 400}}> 
        <Paper elevation={5} style={{backgroundColor: 'lightBlue'}}>
        <Form submit={this.createTodo}/>
         <List >
        {todos.map(todo => (
          <ListItem 
            key={todo.id} 
            role={undefined} 
            dense 
            button  
            onClick={() => this.updateTodo(todo)}
            >
            <Checkbox
              checked={todo.complete}
              tabIndex={-1}
              disableRipple
            />
            <ListItemText primary={todo.text} />
            <ListItemSecondaryAction>
              <IconButton onClick={() => this.removeTodo(todo)}>
                <DeleteIcon color="bgColors.Yellow"/>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>


        </Paper>
        </div>
      </div>
    )
  }
}


//bind graphQL with App component, pass all higher order functions through
//compose function
export default compose(
  graphql(CreateTodoMutation, {name: "createTodo"}), 
  graphql(RemoveMutation, {name: "removeTodo"}), 
  graphql(UpdateMutation, {name: "updateTodo"}), 
  graphql(TodosQuery)
)(App);
