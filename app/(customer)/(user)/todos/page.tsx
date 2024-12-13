import UserTodoComponent from '@/components/todos/userNewTodoComponent'

export default async function UserTodosPage() {
  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <UserTodoComponent />
    </div>
  )
}
