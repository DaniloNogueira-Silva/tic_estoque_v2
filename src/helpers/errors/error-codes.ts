export const errorCodes = {
    INVALID_INPUT: {
        code: 400,
        httpStatus: 'INVALID_INPUT',
        message: 'Entrada inválida. Por favor, verifique os dados fornecidos.'
    },
    UNAUTHORIZED: {
        code: 401,
        httpStatus: 'UNAUTHORIZED',
        message: 'Não autorizado. Você não possui uma conta válida ou token de acesso.'
    },
    NOT_FOUND: {
        code: 404,
        httpStatus: 'NOT_FOUND',
        message: 'Recurso não encontrado.'
    },
    INTERNAL_ERROR: {
        code: 500,
        httpStatus: 'INTERNAL_ERROR',
        message: 'Erro interno do servidor. Por favor, tente novamente mais tarde.'
    },
    DUPLICATE_RESOURCE: {
        code: 409,
        httpStatus: 'DUPLICATE_RESOURCE',
        message: 'Recurso duplicado. Já existe um recurso com esses dados.'
    },
    BAD_REQUEST: {
        code: 400,
        httpStatus: 'BAD_REQUEST',
        message: 'Solicitação inválida. Verifique os parâmetros fornecidos.'
    },
    FORBIDDEN: {
        code: 403,
        httpStatus: 'FORBIDDEN',
        message: 'Acesso negado. Você não tem permissão para executar esta ação.'
    },
    TOKEN_INACTIVE: {
        code: 401,
        httpStatus: 'TOKEN_INACTIVE',
        message: 'Token inativo. O token de acesso fornecido não está mais ativo.'
    },
    INVALID_TOKEN: {
        code: 401,
        httpStatus: 'INVALID_TOKEN',
        message: 'Token inválido. O token de acesso fornecido é inválido ou expirou.'
    }
} as const
