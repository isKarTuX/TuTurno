export function useTurnSession() {
  const documentId = useState<string>('turn-document-id', () => '')
  const serviceId = useState<string>('turn-service-id', () => '')
  const entityId = useState<string>('turn-entity-id', () => '')

  function setDocument(id: string) {
    documentId.value = id
  }

  function setService(id: string) {
    serviceId.value = id
  }

  function setEntity(id: string) {
    entityId.value = id
  }

  function clearSession() {
    documentId.value = ''
    serviceId.value = ''
    entityId.value = ''
  }

  return {
    documentId: readonly(documentId),
    serviceId: readonly(serviceId),
    entityId: readonly(entityId),
    setDocument,
    setService,
    setEntity,
    clearSession,
  }
}