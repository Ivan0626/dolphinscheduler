/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { defineComponent, PropType, ref, watch } from 'vue'
import Form from '@/components/form'
import { useTask } from './use-task'
import getElementByJson from '@/components/form/get-elements-by-json'
import type { ITaskData } from './types'
import { useI18n } from 'vue-i18n'

const props = {
  projectCode: {
    type: Number as PropType<number>,
    default: 0
  },
  data: {
    type: Object as PropType<ITaskData>,
    default: { taskType: 'SHELL' }
  },
  readonly: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  loading: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  from: {
    type: Number as PropType<number>,
    default: 0
  }
}

const NodeDetail = defineComponent({
  name: 'NodeDetail',
  props,
  emits: ['linkEventText'],
  setup(props, { expose, emit }) {
    const { data, projectCode, from, readonly } = props
    const { t } = useI18n()

    const { json, model } = useTask({
      data,
      projectCode,
      from,
      readonly
    })

    const jsonRef = ref(json)
    const formRef = ref()

    const { rules, elements } = getElementByJson(jsonRef.value, model)

    expose({
      form: formRef
    })

    watch(
      () => model.taskType,
      (taskType) => {
        // TODO: Change task type
        if (taskType === 'SUB_PROCESS') {
          // TODO: add linkUrl
          emit(
            'linkEventText',
            true,
            `${t('project.node.enter_child_node')}`,
            ''
          )
        } else {
          emit('linkEventText', false, '', '')
        }
      }
    )

    return { rules, elements, model, formRef }
  },
  render(props: { readonly: boolean; loading: boolean }) {
    const { rules, elements, model } = this
    return (
      <Form
        ref='formRef'
        meta={{
          model,
          rules,
          elements,
          disabled: props.readonly
        }}
        loading={props.loading}
        layout={{
          xGap: 10
        }}
      />
    )
  }
})

export default NodeDetail
