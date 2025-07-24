import { Card, Checkbox, Col, Row, Slider, Typography } from 'antd';
const { Text } = Typography;

export interface PersonInfo {
  id: number;
  name: string,
  shareRatio: number;
}

export interface PeopleRatioProps {
  people: {
    id: number;
    name: string;
  }[];
  onChange?: (value: PersonInfo[] | undefined) => void;
  value?: PersonInfo[];
}

const PeopleRatio = (props: PeopleRatioProps) => {
  const { people, onChange, value } = props;
  const valueMap = value?.reduce((acc, person) => {
    acc.set(person.id, person);
    return acc;
  }, new Map<number, PersonInfo>());
  const peopleMap = people.reduce((acc, person) => {
    acc[person.id] = {
      ...person,
      shareRatio: 1.0,
    };
    return acc;
  }, {} as Record<number, PersonInfo>);

  const handleRatioChange = (id: number, ratio: number) => {
    const newParticipants = value?.map(p => {
      if (p.id === id) {
        return {
          ...p,
          shareRatio: ratio
        }
      }
      return p;
    });
    onChange?.(newParticipants);
  }

  return (
    <Checkbox.Group
      style={{ width: '100%' }}
      value={ valueMap ? Array.from(valueMap.keys()) : []}
      onChange={(checkedValues) => {
        const data: PersonInfo[] = [];
        checkedValues.forEach(id => {
          if(valueMap?.has(id)) {
            data.push(valueMap.get(id)!);
          } else {
            data.push(peopleMap[id]);
          }
        });
        onChange?.(data);
      }}
    >
      <Row gutter={[16, 16]}>
        {people.map(person => {
          const participant = value?.find(p => p.id === person.id);
          const isSelected = !!participant;

          return (
            <Col span={12} key={person.id}>
              <Card size="small" style={{ padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <Checkbox value={person.id}>
                    <Text strong>{person.name}</Text>
                  </Checkbox>
                </div>
                <div style={{ marginLeft: 24 }}>
                  <Slider
                    min={0.5}
                    max={5.0}
                    step={0.5}
                    value={participant?.shareRatio || 1.0}
                    disabled={!isSelected}
                    onChange={(value) => handleRatioChange(person.id, value)}
                    marks={{
                      0.5: '0.5',
                      1.0: '1.0',
                      1.5: '1.5',
                      2.0: '2.0',
                      2.5: '2.5',
                      3.0: '3.0',
                      3.5: '3.5',
                      4.0: '4.0',
                      4.5: '4.5',
                      5.0: '5.0'
                    }}
                    tooltip={{
                      formatter: (value) => `${value}倍`
                    }}
                  />
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Checkbox.Group>
  )
}

export default PeopleRatio;