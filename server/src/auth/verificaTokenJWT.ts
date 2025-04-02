/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import jwt from 'jsonwebtoken'
import { type Role } from './roles'
import { AppError, Status } from '../error/ErrorHandler.js'

type JwtPayload = {
  id: string;
  role: Role;
  // Add other properties as needed
};

export function verificaTokenJWT (...role: Role[]) {
  return (req, res, next): any => {
    if (!req.headers.authorization) { throw new AppError('Nenhum token informado.', Status.BAD_REQUEST) }

    const tokenString: string[] = req.headers.authorization.split(' ')
    const token = tokenString[1]

    // Nenhuma token informado
    if (!token) {
      return res
        .status(403)
        .json({ auth: false, message: 'Nenhum token informado.' })
    }

    if (!process.env.SECRET) {
      throw new AppError('SECRET environment variable is not set', Status.INTERNAL_SERVER_ERROR);
    }

    // Verifica se o token é válido
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      if (err) {
        return res
          .status(403)
          .json({ auth: false, message: 'Falha ao autenticar o token.' })
      }
    
      if (role.length > 0 && !role.includes((decoded as JwtPayload).role)) {
        return res.status(403).json({ auth: false, message: 'Não autorizado' })
      }

      req.userId = (decoded as JwtPayload).id
      next()
    })
  }
}
