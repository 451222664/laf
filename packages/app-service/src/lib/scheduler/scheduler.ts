/*
 * @Author: Maslow<wangfugen@126.com>
 * @Date: 2021-07-30 10:30:29
 * @LastEditTime: 2021-09-09 22:59:48
 * @Description: 
 */

import { getFunctionById } from "../../api/function"
import { addFunctionLog } from "../../api/function-log"
import { CloudFunction, TriggerScheduler } from "cloud-function-engine"
import { createLogger } from "../logger"
import assert = require("assert")


const logger = createLogger('scheduler')

/**
 * FrameworkScheduler derived from TriggerScheduler
 * Override the getting-cloud-function method
 */
export class FrameworkScheduler extends TriggerScheduler {

  /**
   * Load cloud function by id
   * @override
   * @param func_id 
   * @returns 
   */
  async getFunctionById(func_id: string): Promise<CloudFunction> {
    assert(func_id)
    const funcData = await getFunctionById(func_id)
    assert.ok(funcData, `failed to get function data: ${func_id}`)

    const func = new CloudFunction(funcData)
    assert.ok(func.compiledCode, `func.compiledCode got empty: ${func_id}`)
    return func
  }

  /**
   * Will be called by TriggerScheduler
   * @override
   * @param data 
   */
  async addFunctionLog(data: any) {
    await addFunctionLog(data)
  }

  /**
   * Process with internal logs in TriggerScheduler 
   * @override
   * @param params 
   */
  async log(...params: any[]) {
    logger.trace(...params)
  }
}