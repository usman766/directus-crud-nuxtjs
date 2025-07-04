import { ElMessage } from 'element-plus'

export const useMessage = () => {
  const success = (message: string) => {
    ElMessage.success(message)
  }

  const error = (message: string) => {
    ElMessage.error(message)
  }

  const warning = (message: string) => {
    ElMessage.warning(message)
  }

  const info = (message: string) => {
    ElMessage.info(message)
  }

  return {
    success,
    error,
    warning,
    info
  }
} 