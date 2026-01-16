import React from 'react';
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react";
import { cva } from 'class-variance-authority';

interface ICardWrapper {
  header?: React.ReactNode | React.ReactNode[];
  footer?: React.ReactNode | React.ReactNode[];
  className?: string;
  children: React.ReactNode | React.ReactNode[];
}

const header = cva("header", {
  variants: {

  }
});

export function CardWrapper({
  header,
  footer,
  children,
  className
}: ICardWrapper) {
  return (
    <Card className="max-w-[340px] dark">
      {header && <CardHeader>{header}</CardHeader>}
      <CardBody className="p-3 text-small">
        {children}
      </CardBody>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
