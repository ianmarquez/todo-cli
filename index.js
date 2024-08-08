const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const tasks = {}
let previousAction;

const getTodos = () => {

  const addTodo = (input) => {
    const id = Object.values(tasks).length;
    tasks[id] = {
      id,
      value: input,
      status: false
    }
    previousAction.id = id
  }

  const toggleTodoStatus = (taskId) => {
    const taskToBeUpdated = tasks[taskId]
    if (!taskToBeUpdated) {
      console.log(`task with id: ${taskId} does not exist`)
      return;
    }
    taskToBeUpdated.status = !taskToBeUpdated.status
  }

  const undoPreviousAction = () => {
    if (!previousAction) {
      console.log('nothing to undo \n')
      return onCommand()
    }
    if (previousAction.command === "check") {
      const id = previousAction.input
      toggleTodoStatus(id)
    } else {
      const id = previousAction.id
      delete tasks[id]
    }
    previousAction = undefined
  }

  const listTodos = () => {
    const completed = []
    const pending = []

    Object.values(tasks).forEach((task) => {
      if (!task.status) {
        pending.push(task)
      } else {
        completed.push(task)
      }
    })
    console.log("Pending \n")
    pending.forEach(pendingItem => {
      console.log(pendingItem.id, " ", pendingItem.value, "\n")
    })

    console.log("Completed \n")
    completed.forEach(completedItem => {
      console.log(completedItem.id, " ", completedItem.value, "\n")
    })
  }

  const doPrompt = () => {
    rl.question('>', onCommand)
  }

  const onCommand = (input) => {
    const [command, ...userInput] = input.split(' ')

    if (command !== "undo" && command !== "ls") {
      previousAction = {
        command,
        input: userInput.join(" ")
      }
    }

    if (command === 'undo') {
      undoPreviousAction()
    }
    else if (command === 'q') {
      rl.close()
    }
    else if (command === 'ls') {
      listTodos()
    }
    else if (command === 'add') {
      addTodo(userInput.join(" "))
    }
    else if (command === 'check') {
      toggleTodoStatus(userInput)
    }
    else {
      console.log(input, " command not supported")
    }

    doPrompt()
  }
  doPrompt()
}

getTodos()
