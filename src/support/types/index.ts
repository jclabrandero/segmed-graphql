
import { IContext } from './context.type'
import { IEvent } from './event.type'
import { IAuthPayload, IUserCreateArgs, IUserUpdateArgs, IGroupCreateArgs, IGroupUpdateArgs } from './auth.type'
import {
	IPersonDocumentTypeCreateArgs, IPersonDocumentTypeUpdateArgs,
	IEmployeeTypeCreateArgs, IEmployeeTypeUpdateArgs,
	IEmployeePositionCreateArgs, IEmployeePositionUpdateArgs,
	IInsuredTypeCreateArgs, IInsuredTypeUpdateArgs,
	IMedicalSubspecialtyCreateArgs, IMedicalSubspecialtyUpdateArgs
} from './catalog.type'
import {
	IBelongingCreateArgs, IBelongingUpdateArgs,
	IMedicalOfficeCreateArgs, IMedicalOfficeUpdateArgs
} from './reference.type'
import {
	IPersonCreateArgs, IPersonUpdateArgs,
	IClerkCreateArgs, IClerkUpdateArgs,
	IInsuredCreateArgs, IInsuredUpdateArgs
} from './folk.type'

export {
	IAuthPayload,
	IContext,
	IEvent,
	IGroupCreateArgs, IGroupUpdateArgs,
	IUserCreateArgs, IUserUpdateArgs,

	IPersonDocumentTypeCreateArgs, IPersonDocumentTypeUpdateArgs,
	IEmployeeTypeCreateArgs, IEmployeeTypeUpdateArgs,
	IEmployeePositionCreateArgs, IEmployeePositionUpdateArgs,
	IInsuredTypeCreateArgs, IInsuredTypeUpdateArgs,
	IMedicalSubspecialtyCreateArgs, IMedicalSubspecialtyUpdateArgs,

	IBelongingCreateArgs, IBelongingUpdateArgs,
	IMedicalOfficeCreateArgs, IMedicalOfficeUpdateArgs,

	IPersonCreateArgs, IPersonUpdateArgs,
	IClerkCreateArgs, IClerkUpdateArgs,
	IInsuredCreateArgs, IInsuredUpdateArgs
}
