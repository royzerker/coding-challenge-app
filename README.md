import { Alert } from "@/components/ui/alert"

# MatrixOperations Component

Este componente proporciona una interfaz para realizar operaciones con matrices `Q` y `R`, incluyendo rotación y obtención de estadísticas, mediante una API protegida por token JWT.

## ✨ Características

- Entrada interactiva de matrices `Q` y `R` en formato JSON
- Autenticación mediante JWT
- Botones para:
  - Rotar matrices (`/api/rotate`)
  - Obtener estadísticas (`/api/factorize`)
- Visualización de resultados y errores
- UI moderna usando componentes de ShadCN y Lucide

## 📦 Uso

```tsx
import MatrixOperations from "@/components/MatrixOperations"

export default function Page() {
  return <MatrixOperations />
}
